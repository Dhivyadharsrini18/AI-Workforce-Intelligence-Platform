from fastapi import APIRouter
router = APIRouter(tags=['employees'])
@router.get('/employees/dummy')
def dummy(): return {'status': 'ok'}
