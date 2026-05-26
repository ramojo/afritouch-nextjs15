-- Seed catering packages from data/packages.json.
-- Idempotent: re-running the migration won't duplicate rows.

INSERT INTO "packages" (
    "id", "name", "price", "description",
    "starch", "protein", "vegetables", "dessert", "drinks",
    "color", "popular", "images", "position"
) VALUES
(
    'bronze',
    'Bronze Menu',
    'KES 600',
    'Perfect for budget-conscious events that don''t compromise on taste.',
    ARRAY['Pilau','Vegetable Rice','Chapati','A choice of Mukimo, Mashed Potatoes or Parsley Potatoes']::text[],
    ARRAY['Beef stew']::text[],
    ARRAY['Vegetable Salad or Cooked Vegetables']::text[],
    ARRAY['Fruit in season']::text[],
    ARRAY[]::text[],
    'border-amber-700/50',
    false,
    ARRAY[]::text[],
    0
),
(
    'silver',
    'Silver Menu',
    'KES 700',
    'A balanced selection offering more variety for your guests.',
    ARRAY['Rice garnished with vegetables','Pilau','Chapati','A choice of Mukimo, Mashed Potatoes or Parsley Potatoes']::text[],
    ARRAY['Beef Stew','Chicken']::text[],
    ARRAY['Vegetable Salad or Cooked Vegetables']::text[],
    ARRAY['Fruit in season']::text[],
    ARRAY[]::text[],
    'border-slate-400',
    true,
    ARRAY[]::text[],
    1
),
(
    'gold',
    'Gold Menu',
    'KES 1200',
    'Our diverse menu with premium options including drinks.',
    ARRAY['Swahili Rice','Vegetable stir-fried Rice','White and brown Chapati','*Extra Starch Option']::text[],
    ARRAY['Beef Stew','Chicken','Goat fry, Pork or Fish']::text[],
    ARRAY['Stir Fried Vegetables']::text[],
    ARRAY['Fruit Cuts']::text[],
    ARRAY['Soda','Water']::text[],
    'border-yellow-500',
    false,
    ARRAY[]::text[],
    2
),
(
    'gold-plus',
    'Gold Plus Menu',
    'KES 1800',
    'An elevated dining experience with extended variety.',
    ARRAY['Swahili Rice','Chinese stir-fried rice','White and brown Chapati','*Extra Starch Options']::text[],
    ARRAY['Beef Stew','Chicken','Goat fry, Pork or Fish']::text[],
    ARRAY['Vegetarian option','Assortment of Stir Fried Vegetables']::text[],
    ARRAY['Fruit Cuts or Ice Cream']::text[],
    ARRAY['Soda','Water','Fresh Juice']::text[],
    'border-yellow-600',
    false,
    ARRAY[]::text[],
    3
),
(
    'platinum',
    'Platinum Menu',
    'KES 2200',
    'The ultimate culinary experience with comprehensive meal courses.',
    ARRAY['Swahili Pilau','Vegetable Rice','Soft Layered Chapati','Mukimo or Parsley Potatoes','Roast Potatoes/Wedges']::text[],
    ARRAY['Beef Wet Fry/Stew','Glazed Chicken','Mbuzi Wet Fry','Pan Seared Fish Fillet']::text[],
    ARRAY['Creamed Spinach','Traditional Vegetables']::text[],
    ARRAY['Assorted Fruit Platter','Ice Cream','Cake Slices']::text[],
    ARRAY['Soda','Mineral Water','Fresh Juice','Tea/Coffee']::text[],
    'border-slate-300',
    false,
    ARRAY[]::text[],
    4
)
ON CONFLICT ("id") DO NOTHING;
