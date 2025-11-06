# React To-Do App for Agentic Development with GitHub Copilot

This repository contains a simple React To-Do application designed to serve as an example for agentic development using GitHub Copilot. It provides a pre-configured environment with examples of chat modes, prompts, instructions, and agents to streamline AI-assisted development workflows.

## Purpose

The primary goal of this repository is to demonstrate how to structure a project to be "agentic work ready." This includes:

-   **GitHub Copilot Configuration**: Examples of instructions, prompts, and chat modes to guide GitHub Copilot.
-   **Agent Definitions**: An `agents.md` file that defines the roles and capabilities of different AI agents.
-   **Pre-configured for MCP**: The project is set up to be compatible with the Model Context Protocol (MCP).
-   **A Simple Application**: A React To-Do app serves as a practical playground for testing and developing with AI agents.

## What's Inside?

### `.github` Directory

This directory is the heart of the Copilot configuration.

-   **`/agents`**: Contains definitions for different AI agents. For example, `web-developer-agent.md` defines an agent specializing in frontend development.
-   **`/chatmodes`**: Defines different modes for interacting with Copilot, such as `coding`, `research`, and `testing`.
-   **`/instructions`**: Provides specific guidelines for different file types, like `frontend-instructions.md` for React components.
-   **`/prompts`**: A collection of prompts for common development tasks like `feature-development.prompt.md` and `bug-fix.prompt.md`.
-   **`agents.md`**: A file that lists and describes the available agents.
-   **`copilot-instructions.md`**: General instructions for GitHub Copilot to follow throughout the repository.

### `src` Directory

The source code for the simple React To-Do application. This is where you can experiment with agent-driven development.

## Getting Started

1.  **Explore the `.github` directory**: Familiarize yourself with the provided examples of prompts, instructions, and agents.
2.  **Use the To-Do App**: Interact with the React application to have a basis for development tasks.
3.  **Leverage Copilot Chat**: Use the configured prompts and agents to ask Copilot to perform tasks, such as adding a new feature to the To-Do app or fixing a bug. For example, you can use the `feature-development.prompt.md` to ask for a new feature.

This repository is a starting point for building and experimenting with agentic workflows in GitHub Copilot. Feel free to extend and customize it to fit your needs.
