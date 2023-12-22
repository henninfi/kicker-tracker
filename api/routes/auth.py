from fastapi import APIRouter
from models import Base
from fastapi import FastAPI, HTTPException, Depends, Query
from database import engine
from fastapi.middleware.cors import CORSMiddleware  # Import this

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import APIKeyCookie, OAuth2AuthorizationCodeBearer
# from fief_client import FiefAsync, FiefUserInfo, FiefAccessTokenInfo, FiefAsync
# from fief_client.integrations.fastapi import FiefAuth 
from propelauth_fastapi import init_auth
from propelauth_py.user import User


from typing import Dict, Optional
import uuid

router = APIRouter()

auth = init_auth("https://046425272.propelauthtest.com", "88cea7bed3ead5a4bd429eb6a0554472aad4613abbaab289769057a4130125264b46d0f71c90957c79a35058e04abe45")

@router.get("/api/whoami")
async def root(current_user: User = Depends(auth.optional_user)):
    return {"user_id": f"{current_user.user_id}"}

# class CustomFiefAuth(FiefAuth):  
#     client: FiefAsync

#     async def get_unauthorized_response(self, request: Request, response: Response):
#         redirect_uri = request.url_for("auth_callback")  
#         auth_url = await self.client.auth_url(redirect_uri, scope=["openid"])  
#         raise HTTPException(
#             status_code=status.HTTP_307_TEMPORARY_REDIRECT,  
#             headers={"Location": str(auth_url)},
#         )
        
# class MemoryUserInfoCache:  
#     def __init__(self) -> None:
#         self.storage: Dict[uuid.UUID, FiefUserInfo] = {}  

#     async def get(self, user_id: uuid.UUID) -> Optional[FiefUserInfo]:  
#         return self.storage.get(user_id)

#     async def set(self, user_id: uuid.UUID, userinfo: FiefUserInfo) -> None:  
#         self.storage[user_id] = userinfo


# memory_userinfo_cache = MemoryUserInfoCache()  


# async def get_memory_userinfo_cache() -> MemoryUserInfoCache:  
#     return memory_userinfo_cache


# fief = FiefAsync(  
#     "https://rank-it-fief-prod-feifdb.fief.dev",
#     "0w7YQcNlCiHiqljhSUrM5lKKLGwUyaG2rceXB0IElD8",
#     "EdVIx28qzWzViyAGPaw9Z_peAz3u6-RgDOgkMIbJ0jY",
# )
    
# SESSION_COOKIE_NAME = "user_session"
# scheme = APIKeyCookie(name=SESSION_COOKIE_NAME, auto_error=False)  
# auth = CustomFiefAuth(fief, scheme, get_userinfo_cache=get_memory_userinfo_cache)  


# #Auth-endpoints
# @router.get("/auth-callback", name="auth_callback")  
# async def auth_callback(request: Request, response: Response, code: str = Query(...), memory_userinfo_cache: MemoryUserInfoCache = Depends(get_memory_userinfo_cache)):
#     redirect_uri = request.url_for("auth_callback")
#     tokens, userinfo = await fief.auth_callback(code, redirect_uri)

#     response = RedirectResponse(request.url_for("protected"))  
#     response.set_cookie(  
#         SESSION_COOKIE_NAME,
#         tokens["access_token"],
#         max_age=tokens["expires_in"],
#         httponly=True,  
#         secure=False,  
#     )

#     await memory_userinfo_cache.set(uuid.UUID(userinfo["sub"]), userinfo)  

#     return response


@router.get("/protected", name="protected")
async def protected(
    current_user: User = Depends(auth.require_user),  
):
    return HTMLResponse(
        f"<h1>You are authenticated. Your user email is {current_user.user_id}</h1>"
    )