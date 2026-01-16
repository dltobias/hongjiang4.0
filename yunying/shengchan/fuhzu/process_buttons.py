import re
import sys

def process_file(filename, output_filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pattern = r'(<button[^>]*onclick="updateQty\(\'([^\']+)\', 1\)"[^>]*>\+</button>)'
    
    def replace_func(match):
        full_match = match.group(1)
        item_id = match.group(2)
        confirm_btn = f'\n                                    <button class="ml-1 px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded border border-green-100 hover:bg-green-100 transition-colors" onclick="confirmSingleItem(this, \'{item_id}\')">确认</button>'
        return full_match + confirm_btn

    new_content = re.sub(pattern, replace_func, content)
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == "__main__":
    if len(sys.argv) > 2:
        process_file(sys.argv[1], sys.argv[2])
