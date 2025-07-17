from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    # 移除调试信息，避免在生产环境中泄露密码
    result = pwd_context.verify(plain_password, hashed_password)
    return result

def get_password_hash(password: str) -> str:
    """获取密码哈希值"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # 使用配置文件中的过期时间，默认30分钟
        expire = datetime.now(timezone.utc) + timedelta(minutes=getattr(settings, 'access_token_expire_minutes', 30))
    
    to_encode.update({"exp": expire})
    # 添加调试信息来检查 token 生成
    print(f"生成 token，过期时间: {expire}")
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    print(f"生成的 token: {encoded_jwt[:50]}...")  # 只打印前50个字符
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    """验证令牌"""
    try:
        print(f"验证 token: {token[:50]}...")  # 添加调试信息
        print(f"使用密钥: {settings.secret_key[:10]}...")  # 显示密钥前10位
        print(f"使用算法: {settings.algorithm}")
        
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        print(f"解码成功，用户名: {username}")
        print(f"Token 过期时间: {payload.get('exp')}")
        
        if username is None:
            print("用户名为空，抛出异常")
            raise credentials_exception
        return username
    except JWTError as e:
        print(f"JWT 解码失败: {e}")  # 添加详细错误信息
        print(f"Token 内容: {token}")
        raise credentials_exception
