import AbstractSeeder from "./AbstractSeeder";

class UserSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "user", truncate: true });
  }

  run() {
    this.insert({
      username: "demo",
      email: "demo@impulsion.local",
      // Authentification différée : valeur de développement uniquement.
      // À remplacer par un hash lorsque l'authentification sera implémentée.
      password: "demo-password-not-for-auth",
      refName: "user_demo",
    });
  }
}

export default UserSeeder;
