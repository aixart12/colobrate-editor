"""add title to scrape table

Revision ID: 55cb6b63f31d
Revises: f9aaae588906
Create Date: 2024-12-15 06:04:38.567938

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55cb6b63f31d'
down_revision = 'f9aaae588906'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('scraped_data', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(length=200), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('scraped_data', schema=None) as batch_op:
        batch_op.drop_column('title')

    # ### end Alembic commands ###
