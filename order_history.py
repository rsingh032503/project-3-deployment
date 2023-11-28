import datetime as dt
import numpy as np
import random as rand
import psycopg2 as sql

class order:
    id = dt.datetime.now()
    menu_item_table_id = 0
    total = -1
    customer_id = 0
    date_placed = dt.datetime.now()
    items = []
    quantities = []

    def __init__(self,i,t_id,to,c_id,d_pl):
        self.id = i
        self.menu_item_table_id = t_id
        self.total = to
        self.customer_id = c_id
        self.date_placed = d_pl
        self.items = []
        self.quantities = []

    def add_menu_item(self,item):
        if(item in self.items):
            self.quantities[self.items.index(item)] += 1
        else:
            self.items += [item]
            self.quantities += [1]



class menuItem:
    id = -1
    price = 5.0
    name = ""

    def __init__(self,i,p,n):
        self.id = i
        self.price = p
        self.name = n

class Customer:
    id = -1
    name = ""
    email = ""
    orders = []

    def __init__(self,i,n,e):
        self.id = i
        self.name = n
        self.email = e
        self.orders = []

    def add_order(self,order):
        self.orders += [order]


print("establishing connection")
connection = sql.connect(host='csce-315-db.engr.tamu.edu',
                             user='csce315_909_bat2492',
                             password='BT2415',
                             database='csce315331_09m_db')
print("established connection")
with connection:
    with connection.cursor() as cursor:

        query = "Truncate table menu_item_order_join_table;"
        cursor.execute(query)

        query = "Truncate table customer_order_join_table;"
        cursor.execute(query)

        query = "Truncate table order_table CASCADE;"
        cursor.execute(query)

    connection.commit()

    with connection.cursor() as cursor:
        query = "Select * from menu_item;"
        cursor.execute(query)
        result = cursor.fetchall()
        
    menu_items = result
    with connection.cursor() as cursor:
        query = "Select * from customer"
        cursor.execute(query)
        result = cursor.fetchall()
    
    customers = result

for i in range(len(customers)):
    print(customers[i])
    customers[i] = Customer(customers[i][0],customers[i][1],customers[i][2])

for i in range(len(menu_items)):
    print(menu_items[i])
    menu_items[i] = menuItem(menu_items[i][0],menu_items[i][1],menu_items[i][2])




#order_file.write("id,totalprice,date_placed\n")
#join_table_file.write("Order_ID,Menu_item\n")
orders = []
times = np.linspace(11,22.5,24)
weights = {"monday"   : [1,1,2,2,4,4,5,5,9,9,5,5,3,3,3,3,5,5,9,9,7,7,4,4],
           "tuesday"  : [1,1,2,2,3,3,5,5,7,7,4,4,4,4,5,5,10,10,14,14,11,11,4,4],
           "wednesday": [3,3,5,5,6,6,4,4,5,5,3,3,3,3,6,6,2,2,1,1,4,4,10,10],
           "thursday" : [6,6,5,5,3,3,2,2,3,3,2,2,3,3,6,6,5,5,7,7,3,3,4,4],
           "friday"   : [7,7,6,6,10,10,9,9,5,5,7,7,8,8,7,7,11,11,7,7,5,5,6,6],
           "saturday" : [3,3,8,8,7,7,10,10,8,8,4,4,3,3,3,3,7,7,3,3,0,0,1,1],
           "sunday"   : [1,1,3,3,5,5,5,5,5,5,4,4,5,5,6,6,5,5,3,3,2,2,1,1]}

days_in_month = {1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}

total = 1100000.0
num_orders = 20000
date_year = dt.datetime.now().year - 1
date_month = dt.datetime.now().month
date_day = dt.datetime.now().day


order_id = 0    


average_item_price = 0.0
for item in menu_items:
    average_item_price += item.price / len(menu_items)

total_items_ordered = total / average_item_price
average_items_per_order = total_items_ordered / num_orders
num_orders_per_day = num_orders / 365

print(f"average item price: {average_item_price}")
print(f"average items per order: {average_items_per_order}")
print(f"num orders per day: {num_orders_per_day}")

for week in range(52):
    for day in weights:
        day_orders = rand.randint((num_orders_per_day*.99)//1,(num_orders_per_day*1.3)//1)
        day_items = rand.randint((average_items_per_order*.99)//1,(average_items_per_order*1.3)//1)
        if (week == 44 or week == 15) and day == "friday":
            day_orders = rand.randint((num_orders_per_day*1.3)//1,(num_orders_per_day*1.5)//1)
            day_items = rand.randint((average_items_per_order*1.3)//1,(average_items_per_order*1.5)//1)
        
        for order_num in range(day_orders):
            customer = customers[rand.randint(0,len(customers)-1)]
            order_time = rand.choices(times,weights=weights[day],k=1)
            order_hour = np.int_(order_time[0])
            order_minute = np.int_((order_time[0] % 1) * 60)
            order_second = dt.datetime.now().second
            order_microsecond = dt.datetime.now().microsecond

            date = dt.datetime(date_year,date_month,date_day,order_hour,order_minute,order_second,order_microsecond)
            current_order = order(order_id,0,0.0,-1,date)
            order_id += 1

            order_items = rand.randint((day_items*.9)//1,day_items)
            for i in range(order_items):
                menu_item = menu_items[rand.randint(0,len(menu_items)-1)]
                price = menu_item.price
                total -= price
                current_order.total += price
                current_order.add_menu_item(menu_item)
            orders += [current_order]
            customer.add_order(current_order)

        date_day += 1
        if date_day > days_in_month[date_month]:
            date_day = 1
            if date_month == 12:
                date_month = 1
                date_year += 1
            else:
                date_month += 1

num_orders = 0
for c in customers:
    num_orders += len(c.orders)

print(f"num orders via customers: {num_orders}")
print(f"num orders via order list: {len(orders)}")
order_file = open("tables/order_table.csv",'w')
order_item_join_file = open("tables/menu_item_order_join_table.csv",'w')
customer_order_join_file = open("tables/customer_order_join_file.csv",'w')

order_file.write(f"id,totalprice,date_placed\n")
customer_order_join_file.write(f"orderid,customerid\n")
order_item_join_file.write(f"menuitemid,orderid,quantity\n")


finished_orders = 0
with connection:
    with connection.cursor() as cursor:
        for c in customers:
            for o in c.orders:
                order_file.write(f"{o.id},{o.total},'{o.date_placed}'\n")
                customer_order_join_file.write(f"{o.id},{c.id}\n")
                

                

                for i in range(len(o.items)):
                    #print(f"inserting menu item for order {finished_orders}")
                    order_item_join_file.write(f"{o.items[i].id},{o.id},{o.quantities[i]}\n")
                    
                  
                
                finished_orders += 1
                if(finished_orders % 1000 == 0):
                    print(f"finished orders: {finished_orders}")
        
        order_file.close()
        order_item_join_file.close()
        customer_order_join_file.close()


        order_file = open("tables/order_table.csv",'r')
        order_item_join_file = open("tables/menu_item_order_join_table.csv",'r')
        customer_order_join_file = open("tables/customer_order_join_file.csv",'r')
        cursor.copy_from(order_file,'order_table',sep=',',columns=["id","totalprice","date_placed"])
        cursor.copy_from(customer_order_join_file,'customer_order_join_table',sep=',',columns=["orderid","customerid"])
        cursor.copy_from(order_item_join_file,'menu_item_order_join_table',sep=',',columns=["menuitemid","orderid","quantity"])
        connection.commit()  
            



print(f"total remaining: {total}")

"""
Three commands to copy the files into table must be in tables folder when entering the db
\copy order_table from 'tables/order_table.csv' CSV HEADER;
\copy customer_order_join_table (orderid,customerid) from 'tables/customer_order_join_file.csv' CSV HEADER;
\copy menu_item_order_join_table (menuitemid,orderid,quantity) from 'tables/menu_item_order_join_table.csv' CSV HEADER;
 """