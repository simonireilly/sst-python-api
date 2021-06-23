from typing import List, Optional

from mangum import Mangum
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float


app = FastAPI()


@app.get("/v1/items")
def pong() -> List[Item]:
    """
        Sanity check.

        This will let the user know that the service is operational.

        And this path operation will:
        * show a life sign

        """
    return {"items": "pong!"}


@app.post("/v1/items")
def create_item(item: Item):
    return item


handler = Mangum(app, lifespan="off")
