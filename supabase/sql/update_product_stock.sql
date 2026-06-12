create or replace function public.update_product_stock(p_product_id uuid, p_quantity_change integer)
returns integer as $$
declare
  new_stock integer;
begin
  update products
  set stock = stock + p_quantity_change,
      updated_at = now()
  where id = p_product_id
    and stock + p_quantity_change >= 0
  returning stock into new_stock;

  if new_stock is null then
    raise exception 'Insufficient stock or product not found';
  end if;

  return new_stock;
end;
$$ language plpgsql security definer;
