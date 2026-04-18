from fastapi import APIRouter

router = APIRouter()

@router.get('/styles')
async def get_styles():
    return [
        {'id': 'style_1', 'name': 'Katalog Çekimi'},
        {'id': 'style_2', 'name': 'Doğa Konsepti'},
    ]
