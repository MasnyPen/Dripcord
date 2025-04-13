import { PermissionResolvable } from "discord.js";

export function Permissions(perms: PermissionResolvable[]) {
  return function <T extends { new (...args: any[]): {} }>(
    constructor: T,
  ) {
    return class extends constructor {
      permissions = perms;

      async checkPermissions(interaction: any, client: any) {
        if (!interaction?.memberPermissions?.has(perms)) {
          await interaction.reply({
            content: `No required permissions: ${perms.join(", ")}`,
            ephemeral: true,
          });
          return false;
        }
        return true;
      }
    };
  };
}
