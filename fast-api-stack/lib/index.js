import MyStack from "./MyStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "python3.7"
  });

  new MyStack(app, "my-stack");

  // Add more stacks
}
