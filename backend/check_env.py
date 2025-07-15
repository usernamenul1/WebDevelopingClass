"""
开发环境检查脚本
检查 Python 环境和依赖是否正确安装
"""

import sys
import subprocess
import pkg_resources
from pathlib import Path

def check_python_version():
    """检查 Python 版本"""
    print("=== Python 环境检查 ===")
    print(f"Python 版本: {sys.version}")
    
    # 检查是否为 Python 3.8+
    if sys.version_info >= (3, 8):
        print("✅ Python 版本符合要求 (3.8+)")
        return True
    else:
        print("❌ Python 版本过低，需要 3.8 或更高版本")
        return False

def check_dependencies():
    """检查依赖包"""
    print("\n=== 依赖包检查 ===")
    
    requirements_file = Path("requirements.txt")
    if not requirements_file.exists():
        print("❌ requirements.txt 文件不存在")
        return False
    
    # 读取依赖列表
    with open(requirements_file, 'r', encoding='utf-8') as f:
        requirements = f.read().strip().split('\n')
    
    missing_packages = []
    
    for requirement in requirements:
        if requirement.strip() and not requirement.startswith('#'):
            package_name = requirement.split('==')[0].split('[')[0].strip()
            try:
                pkg_resources.get_distribution(package_name)
                print(f"✅ {package_name}")
            except pkg_resources.DistributionNotFound:
                print(f"❌ {package_name} - 未安装")
                missing_packages.append(requirement)
    
    if missing_packages:
        print(f"\n缺少 {len(missing_packages)} 个依赖包")
        print("请运行以下命令安装：")
        print("pip install -r requirements.txt")
        return False
    else:
        print("\n✅ 所有依赖包已正确安装")
        return True

def check_database():
    """检查数据库"""
    print("\n=== 数据库检查 ===")
    
    db_file = Path("sports_platform.db")
    if db_file.exists():
        print(f"✅ 数据库文件存在: {db_file}")
        print(f"   文件大小: {db_file.stat().st_size} 字节")
        return True
    else:
        print("❌ 数据库文件不存在")
        print("请运行 python init_db.py 创建数据库")
        return False

def check_env_file():
    """检查环境配置文件"""
    print("\n=== 环境配置检查 ===")
    
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("✅ .env 配置文件存在")
        return True
    elif env_example.exists():
        print("⚠️ .env 文件不存在，但找到 .env.example")
        print("请复制 .env.example 为 .env 并根据需要修改配置")
        return False
    else:
        print("❌ 缺少环境配置文件")
        return False

def run_health_check():
    """运行健康检查"""
    print("=== 体育活动平台 - 环境健康检查 ===\n")
    
    checks = [
        check_python_version(),
        check_dependencies(),
        check_env_file(),
        check_database(),
    ]
    
    passed = sum(checks)
    total = len(checks)
    
    print(f"\n=== 检查结果 ===")
    print(f"通过: {passed}/{total}")
    
    if passed == total:
        print("🎉 环境配置完善，可以启动应用！")
        print("\n建议命令:")
        print("  启动应用: python run.py")
        print("  API 文档: http://localhost:8000/docs")
    else:
        print("⚠️ 发现问题，请按照上述提示解决")
    
    return passed == total

if __name__ == "__main__":
    run_health_check()
