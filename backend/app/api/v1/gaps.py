from fastapi import APIRouter
router = APIRouter(tags=['gaps'])
@router.get('/gaps/dummy')
def dummy(): return {'status': 'ok'}
