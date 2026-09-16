"""Compare the published Brief ZIP with its source files without extracting it."""
from pathlib import Path
from zipfile import ZipFile


def check_package(source, archive):
    source = Path(source)
    expected = {
        "nexo-brief/" + file.relative_to(source).as_posix(): file
        for file in source.rglob("*") if file.is_file()
    }
    if not expected:
        raise ValueError("Brief source directory is empty or missing")
    with ZipFile(archive) as package:
        entries = [entry for entry in package.infolist() if not entry.is_dir()]
        names = [entry.filename for entry in entries]
        if len(names) != len(set(names)):
            raise ValueError("Duplicate files in Brief ZIP")
        missing = sorted(expected.keys() - set(names))
        extra = sorted(set(names) - expected.keys())
        if missing or extra:
            raise ValueError(f"Brief ZIP file list differs: missing={missing}, extra={extra}")
        for entry in entries:
            file = expected[entry.filename]
            if entry.file_size != file.stat().st_size:
                raise ValueError(f"Brief ZIP differs: {entry.filename}")
            if package.read(entry) != file.read_bytes():
                raise ValueError(f"Brief ZIP differs: {entry.filename}")
    return len(expected)


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    count = check_package(root / "products/brief-kit", root / "products/nexo-brief-v1.zip")
    print(f"Brief ZIP: {count} files match the source exactly. No Gumroad delivery test is implied.")
