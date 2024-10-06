import os
import re

def extract_filenames(directory):
    filenames = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            filenames.append(os.path.join(root, file))
    return filenames

def extract_strings(filename):
    drv_strings = []
    rad_strings = []
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        print(filename)

        # Extract strings that start with <rad>
        rad_matches = re.findall(r'<rad>([^<]*)</rad>', content)
        for match in rad_matches:
            rad_strings.append(match)

        # Extract strings that start with <drv mrk="">
        drv_matches = re.findall(r'<drv mrk="([^"]*)"', content)
        for match in drv_matches:
            drv_strings.append(match)


    return drv_strings, rad_strings

def save_to_text_file(filename_strings, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for filename, (drv_list, rad_list) in filename_strings:
            rad_extracted = ", ".join(rad_list) if rad_list else "No <rad> found"
            drv_extracted = ", ".join(drv_list) if drv_list else "No <drv mrk> found"
            f.write(f'{filename}, <rad>: [{rad_extracted}], <drv mrk>: [{drv_extracted}]\n')

if __name__ == "__main__":
    directory = "./XML"  # Specify the directory path you want to search
    output_file = "extracted2_strings.txt"  # Specify the output text file name

    filenames = extract_filenames(directory)
    filename_strings = [(filename, extract_strings(filename)) for filename in filenames]
    save_to_text_file(filename_strings, output_file)
    print("Extracted strings saved to", output_file)
