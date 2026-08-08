from fastapi import APIRouter
router = APIRouter(tags=['decision'])
@router.get('/decision/dummy')
def dummy(): return {'status': 'ok'}
