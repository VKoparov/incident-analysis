# Asynchronous Incident Report Analysis Service

## Overview
Veridian Dynamics, a global leader in industrial manufacturing, relies on a team of compliance officers to review thousands of internal incident reports annually. These text-based reports detail everything from minor equipment malfunctions to potential safety hazards. Currently, officers manually read each report to categorize its severity, summarize its content, and identify key entities (like machine IDs or personnel involved). This process is time-consuming and prone to inconsistency, creating a bottleneck that delays risk mitigation efforts. Your task is to build a prototype service that automates the initial triage of these reports.

The goal is to create a full-stack web application that allows a user to submit a text-based incident report. The backend service should accept this text and process it asynchronously to generate a structured analysis (e.g., a brief summary, sentiment, and extracted keywords). Because analysis of a long report can take time, the API and UI must be designed to handle this non-blocking, asynchronous workflow. The user should be able to submit a report and see the results later without waiting for the request to complete synchronously.

A successful submission will demonstrate thoughtful system design for asynchronous tasks, a clean and practical API, and robust, well-tested code. The frontend does not need to be visually polished; a functional user interface that clearly communicates the status of the analysis (e.g., 'processing', 'complete') and displays the final result is sufficient. The core 'analysis' logic can be a simple mock function that uses a timeout to simulate processing time; you are not expected to implement a real AI model.

## Deliverables
- A public GitHub repository URL containing your complete solution.
- A comprehensive README.md file that explains your design decisions, trade-offs, and provides clear instructions on how to build, run, and test the application.
- A backend service written in TypeScript/Node.js that exposes a RESTful API for submitting text for analysis and retrieving the results.
- A frontend web application (e.g., using React, Next.js, or plain HTML/CSS/JS) that provides a UI to submit text and display the asynchronous results from the backend.
- Your full AI assistant conversation log(s) (e.g., Copilot Chat export, Claude conversation history) committed to the repository. Please also note in the README which tools you used and for what parts of the project.

## Suggested tools / libraries
- Backend: Node.js, Express or Fastify
- Frontend: React + Vite, Next.js, or plain HTML/CSS/JS with the `fetch` API
- Testing: Jest or Vitest
- Containerization: Docker, Docker Compose
- Data Storage: A simple in-memory store, a local JSON file, or SQLite for managing job state is sufficient.

## On AI assistants & follow-up
- We encourage you to use documentation, open-source libraries, and AI assistants as you would on the job. Please cite your sources and tool usage in the README.
- You must commit your full AI assistant conversation log(s) (e.g., VS Code's 'Export Chat Session', Claude's 'Copy Conversation', etc.) to your repository. This is a required deliverable.
- Be prepared to walk us through your code, explain your design choices, and discuss the trade-offs you made during the follow-up interview.
- Your submission must be your own work. We will focus our follow-up questions on the 'why' behind your implementation, not just the 'what'.

## How to submit
Reply to this email with **one** public GitHub repository or gist URL containing your solution.