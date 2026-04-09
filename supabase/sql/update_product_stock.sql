create or replace function public.update_product_stock(product_id uuid, qty integer)
returns void as $$
begin
  update products set stock = stock - qty where id = product_id;
end;
$$ language plpgsql security definer;
