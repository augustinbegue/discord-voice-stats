# Discord Stats Bot

This is a simple Discord bot that collects and displays statistics about the voice channel usage of your server. Follow the steps below to run the bot on your machine.

## Prerequisites

Before running the bot, make sure you have the following installed:

-   [Bun](https://bun.sh/)

## Installation

1. Clone this repository to your local machine.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the required dependencies:

    ```
    bun install
    ```

## Configuration

1. Create a new Discord application and bot on the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy the bot token generated for your application.
3. Ensure you have a `.env` file in the root of your project directory with the following content:

    ```sh
    DISCORD_TOKEN=your_bot_token_here
    DISCORD_CLIENT_ID=your_client_id_here
    ```

## Running the Bot

1. In the terminal, navigate to the project directory.
2. Run the following command to start the bot:

    ```
    bun index.ts
    ```

## Usage

Once the bot is running, add it to your Discord server.
Use the `/leaderboard` command to display the voice channel usage statistics.

![Leaderboard](https://i.imgur.com/VLrJJEJm.jpg)
