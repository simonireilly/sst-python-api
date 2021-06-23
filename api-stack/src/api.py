from typing import List, Optional

from mangum import Mangum
from fastapi import FastAPI

from pydantic import BaseModel, validator
from datetime import date, timedelta


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    date: date

    @validator('date')
    def check_date_is_valid(cls, v):
        if v > date.today():
            raise ValueError('Date must be in the past.')
        if v < date.today() - timedelta(days=120):
            raise ValueError('Date must be within 120 days')
        return v


APP = FastAPI(
    title="Example Test API",
    description="Describe API documentation to be served; types come from "
    "pydantic, routes from the decorators, and docs from the fastapi internal",
    version="0.0.1",
)


@APP.get("/v1/items", response_model=List[Item])
def list_items():
    """
    Return a collection of items
    """
    return [
        Item(
            name="Purple Jumper",
            price=10.99,
            date=date.today()
        ),
        Item(
            name="Red Jumper",
            price=11.99,
            date=date.today() - timedelta(days=10)
        )
    ]


@APP.post("/v1/items", response_model=Item)
def create_item(item: Item):
    """
    Create a new item
    """
    return item


handler = Mangum(APP, lifespan="off")
