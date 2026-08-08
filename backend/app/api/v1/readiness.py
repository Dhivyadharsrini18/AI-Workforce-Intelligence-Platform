from fastapi import APIRouter
router = APIRouter(tags=['readiness'])
@router.get('/readiness/dummy')
def dummy(): return {'status': 'ok'}
