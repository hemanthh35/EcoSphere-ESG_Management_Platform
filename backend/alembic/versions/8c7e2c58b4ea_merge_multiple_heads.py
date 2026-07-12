"""merge_multiple_heads

Revision ID: 8c7e2c58b4ea
Revises: 9f87092e434c, e2376774f40c
Create Date: 2026-07-12 15:31:33.320779

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c7e2c58b4ea'
down_revision: Union[str, None] = ('9f87092e434c', 'e2376774f40c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
