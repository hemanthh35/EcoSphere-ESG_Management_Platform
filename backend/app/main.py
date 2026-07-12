from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.modules.department.router import router as department_router
from app.modules.auth.router import router as auth_router
from app.modules.category.router import router as category_router
from app.modules.employee.router import router as employee_router
from app.modules.product_esg.router import router as product_esg_router
from app.modules.environmental.router import router as environmental_router

app = FastAPI(
    title="EcoSphere ESG Management Platform",
    description="API for EcoSphere: Environmental, Social, and Governance Management Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(department_router)
app.include_router(category_router)
app.include_router(employee_router)
app.include_router(product_esg_router)
app.include_router(environmental_router)



@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "EcoSphere API"}
