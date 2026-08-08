from fastapi import APIRouter
router = APIRouter(tags=['forecast'])
@router.get('/forecast/dummy')
def dummy(): return {'status': 'ok'}
