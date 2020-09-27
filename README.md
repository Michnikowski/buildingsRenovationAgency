# Buildings renovation agency
JavaScript CRUD application (NodeJS, ExpressJS, postgreSQL, sequelize, handlebars)

Manager needs to book contractors for renovation work in given buildings.

Models:

Contractor (basic personal info like full name and company details)
Location (just address of the building)
Booking (contractor, location, from/to dates)

Tasks:

- prepare models and corresponding database structure in migrations
- identify and write the correct relations for those models
- make CRUD interface for Contractors, Locations and Bookings with simple front end
- for Booking: make sure that bookings are not overlapping i.e. one contractor cannot be booked for many buildings if date periods are overlapping with each other
- on the main page of the application display the following stats:
  - top 5 contractors with the greatest number of bookings,
  - top 5 contractors with the greatest number of upcoming bookings (don't count any past bookings)
  - top 5 buildings with upcoming bookings
