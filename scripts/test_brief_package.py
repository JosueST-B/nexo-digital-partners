"""Regression cases for the download/source consistency gate."""
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import warnings
from zipfile import ZipFile

from check_brief_package import check_package


class BriefPackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.source = Path(self.temp.name) / "source"
        (self.source / "assets").mkdir(parents=True)
        (self.source / "index.html").write_bytes(b"<html>demo</html>")
        (self.source / "assets/icon.bin").write_bytes(b"\x00\x01\x02")
        self.archive = Path(self.temp.name) / "brief.zip"
        self.entries = {
            "nexo-brief/index.html": b"<html>demo</html>",
            "nexo-brief/assets/icon.bin": b"\x00\x01\x02",
        }

    def package(self, entries):
        with ZipFile(self.archive, "w") as archive:
            for name, content in entries.items():
                archive.writestr(name, content)

    def test_matching_files(self):
        self.package(self.entries)
        self.assertEqual(check_package(self.source, self.archive), 2)

    def test_missing_file(self):
        self.entries.pop("nexo-brief/assets/icon.bin")
        self.package(self.entries)
        with self.assertRaisesRegex(ValueError, "missing="):
            check_package(self.source, self.archive)

    def test_unexpected_file(self):
        self.entries["../unexpected.txt"] = b"not part of the product"
        self.package(self.entries)
        with self.assertRaisesRegex(ValueError, "extra="):
            check_package(self.source, self.archive)
        self.assertFalse((Path(self.temp.name) / "unexpected.txt").exists())

    def test_duplicate_file(self):
        self.package(self.entries)
        with ZipFile(self.archive, "a") as archive, warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            archive.writestr("nexo-brief/index.html", self.entries["nexo-brief/index.html"])
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            check_package(self.source, self.archive)

    def test_same_size_different_content(self):
        self.entries["nexo-brief/assets/icon.bin"] = b"\x00\x01\x03"
        self.package(self.entries)
        with self.assertRaisesRegex(ValueError, "differs"):
            check_package(self.source, self.archive)

    def test_different_size(self):
        self.entries["nexo-brief/assets/icon.bin"] = b"\x00"
        self.package(self.entries)
        with self.assertRaisesRegex(ValueError, "differs"):
            check_package(self.source, self.archive)

    def test_new_source_not_packaged(self):
        self.package(self.entries)
        (self.source / "new.js").write_bytes(b"const example = 1;")
        with self.assertRaisesRegex(ValueError, "missing="):
            check_package(self.source, self.archive)

    def test_missing_source(self):
        self.package(self.entries)
        with self.assertRaisesRegex(ValueError, "empty or missing"):
            check_package(self.source / "missing", self.archive)


if __name__ == "__main__":
    unittest.main()
