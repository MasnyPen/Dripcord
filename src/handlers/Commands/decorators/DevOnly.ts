export function DevOnly() {
    return function <T extends { new (...args: any[]): any }>(Base: T) {
      return class extends Base {
        devOnly = true;
  
        async execute(...args: any[]) {
          const interaction = this.interaction;
          const client = this.client;
  
          if (!interaction || !client) {
            console.warn("Missing interaction or client.");
            return;
          }
  
          const isDev = client.getDevs().includes(interaction.user.id);
  
          if (!isDev) {
            await interaction.reply({
              content: "Only the bot developer can use this command!",
              ephemeral: true,
            });
            return;
          }
  
          if (typeof super.execute === "function") {
            return await super.execute(...args);
          }
        }
      };
    };
  }
  