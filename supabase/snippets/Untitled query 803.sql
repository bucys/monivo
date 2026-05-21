select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name in (
    'tax_mode',
    'iv_expense_mode',
    'include_psd',
    'custom_tax_percent',
    'vl_yearly_cost_cents',
    'vl_valid_until'
  );