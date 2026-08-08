from fastapi import APIRouter
router = APIRouter(tags=['departments'])
@router.get('/departments/dummy')
def dummy(): return {'status': 'ok'}
