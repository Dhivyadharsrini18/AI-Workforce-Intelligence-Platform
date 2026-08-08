from fastapi import APIRouter
router = APIRouter(tags=['recommendations'])
@router.get('/recommendations/dummy')
def dummy(): return {'status': 'ok'}
