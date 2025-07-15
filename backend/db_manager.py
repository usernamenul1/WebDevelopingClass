"""
数据库管理工具
提供数据库的创建、重置、备份等功能
"""

import os
import sqlite3
import shutil
from datetime import datetime
from app.database import SessionLocal, engine
from app import models
import init_db

def backup_database():
    """备份数据库"""
    db_file = "sports_platform.db"
    if os.path.exists(db_file):
        backup_name = f"sports_platform_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        shutil.copy2(db_file, backup_name)
        print(f"数据库已备份到: {backup_name}")
        return backup_name
    else:
        print("数据库文件不存在")
        return None

def reset_database():
    """重置数据库"""
    db_file = "sports_platform.db"
    
    # 备份现有数据库
    backup_file = backup_database()
    
    # 删除现有数据库
    if os.path.exists(db_file):
        os.remove(db_file)
        print("已删除现有数据库")
    
    # 重新创建数据库和测试数据
    print("正在重新创建数据库...")
    init_db.init_db()
    init_db.create_test_data()
    print("数据库重置完成！")

def show_database_info():
    """显示数据库信息"""
    db_file = "sports_platform.db"
    
    if not os.path.exists(db_file):
        print("数据库文件不存在")
        return
    
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    print("=== 数据库信息 ===")
    print(f"数据库文件: {db_file}")
    print(f"文件大小: {os.path.getsize(db_file)} 字节")
    
    # 获取表信息
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"\n数据表数量: {len(tables)}")
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"  - {table_name}: {count} 条记录")
    
    conn.close()

def main():
    """主菜单"""
    while True:
        print("\n=== 数据库管理工具 ===")
        print("1. 显示数据库信息")
        print("2. 初始化数据库")
        print("3. 重置数据库")
        print("4. 备份数据库")
        print("5. 退出")
        
        choice = input("\n请选择操作 (1-5): ").strip()
        
        if choice == '1':
            show_database_info()
        elif choice == '2':
            init_db.init_db()
            init_db.create_test_data()
        elif choice == '3':
            confirm = input("确定要重置数据库吗？这将删除所有数据 (y/N): ").strip().lower()
            if confirm == 'y':
                reset_database()
        elif choice == '4':
            backup_database()
        elif choice == '5':
            print("再见！")
            break
        else:
            print("无效选择，请重试")

if __name__ == "__main__":
    main()
