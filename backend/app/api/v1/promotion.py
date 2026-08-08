from fastapi import APIRouter
router = APIRouter(tags=['promotion'])
@router.get('/promotion/dummy')
def dummy(): return {'status': 'ok'}
