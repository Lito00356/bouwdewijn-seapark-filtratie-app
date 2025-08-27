import bcrypt from "bcrypt";

const tableName = "users";

const seed = async function (knex) {
  await knex(tableName).truncate();

  const pin = "0000";
  const hashedPin = await bcrypt.hash(pin, 10);
  await knex(tableName).insert([
    {
      firstname: "Admin",
      lastname: "Admin",
      email: "Admin@example.com",
      pin: hashedPin,
      is_admin: 1,
      is_active: 1,
    },
    {
      firstname: "Dick",
      lastname: "Grayson",
      email: "Dicky.Grayson@example.com",
      pin: hashedPin,
      is_admin: 0,
      is_active: 1,
    },
    {
      firstname: "Jack",
      lastname: "Napier",
      email: "Jacky.Napier@example.com",
      pin: hashedPin,
      is_admin: 0,
      is_active: 1,
    },
    {
      firstname: "Zeger",
      lastname: "Schaeverbeke",
      email: "Zeger.Schaeverbeke@example.com",
      pin: hashedPin,
      is_admin: 0,
      is_active: 1,
    },
    {
      firstname: "Sverre",
      lastname: "Baeke",
      email: "Sverre.Baeke@example.com",
      pin: hashedPin,
      is_admin: 0,
      is_active: 1,
    },
    {
      firstname: "Tomasz",
      lastname: "Liksza",
      email: "Tomasz.Liksza@example.com",
      pin: hashedPin,
      is_admin: 0,
      is_active: 1,
    },
  ]);
};

export { seed };
