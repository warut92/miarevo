import os
import re

def extract_filenames(directory):
    filenames = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            filenames.append(os.path.join(root, file))
    return filenames

def extract_strings(filename):
    strings = []
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r'<drv mrk="([^"]*)"', content)
        for match in matches:
            strings.append(match)
    return strings

def save_to_text_file(filename_strings, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for filename, string_list in filename_strings:
            f.write(f'{filename}, {", ".join(string_list)}\n')

if __name__ == "__main__":
    directory = "."  # Specify the directory path you want to search
    output_file = "0extracted_strings.txt"  # Specify the output text file name

    filenames = extract_filenames(directory)
    filename_strings = [(filename, extract_strings(filename)) for filename in filenames]
    save_to_text_file(filename_strings, output_file)
    print("Extracted strings saved to", output_file)
