from fastapi import APIRouter
router = APIRouter(tags=['attrition'])
@router.get('/attrition/dummy')
def dummy(): return {'status': 'ok'}
