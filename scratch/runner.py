# -*- coding: utf-8-bom -*-
import subprocess
import sys
import os

def main():
    # 取得 target.py 的絕對路徑
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_path = os.path.join(current_dir, "target.py")
    
    print(f"正在執行: {target_path}")
    
    # 複製當前環境變數並強制設定 Python IO 編碼為 utf-8
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    
    # 執行 target.py 並捕獲輸出
    try:
        result = subprocess.run(
            [sys.executable, target_path],
            capture_output=True,
            env=env,
            check=True
        )
        print("--- 執行結果 ---")
        # 安全地以 utf-8 解碼，若終端機不支援部分字元則替換，避免當機
        print(result.stdout.decode("utf-8", errors="replace"))
    except subprocess.CalledProcessError as e:
        print(f"執行失敗: {e}")
        print(e.stderr)

if __name__ == "__main__":
    main()
