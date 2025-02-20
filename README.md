# ILoveIMG API - Node.js Library  

A Node.js library for interacting with the [ILoveIMG API](https://www.iloveapi.com/products/image-rest-api).

## ⚠️ Important Before You Start  
- This library is **not** officially developed by the ILoveIMG [team](https://github.com/ilovepdf). I created it because I needed ILoveIMG’s tools (especially for image processing) in my application, and there was no official Node.js library available. Before using this library, please **cross-check** with the [official documentation](https://www.iloveapi.com/docs/api-reference) to ensure compatibility, especially for the available options and parameters of each specific tool.
- As of the time you're reading this, this library **does not yet** support all ILoveIMG tools. Currently, it only supports:  
  - `convertimage`  
  - `upscaleimage`  
  - `watermarkimage`  
  - `removebackgroundimage`
- It only supports uploading or adding images from a public URL, so you need to use an image or storage provider that can serve your image publicly.
- Some implementations in this library **may differ** from ILoveApi's official library behavior.
- You may need to read and understand how their API [request workflows](https://www.iloveapi.com/docs/api-reference#request-workflow) works first.
- I do **not** have a fixed timeline for updates, so contributions via pull requests (PRs) are highly welcome🚀

## 📌 When Should You Use This Library?  
Use this library if:  
- You need to integrate ILoveApi’s image services into a **Node.js** application.  
- Your project follows **ES Module (ESM)** syntax (`import`), not CommonJS (`require`).
- You want **strong type definitions** and **clear documentation** in your code editor to simplify development.  

## 📖 Introduction  
This library is built using **[Axios](https://axios-http.com/)**, **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**, and **[Zod](https://zod.dev/)**, along with some development dependencies for testing.  
- **Axios** handles communication with the ILoveIMG API.  
- **jsonwebtoken** is used to generate the **[self-signed](https://www.iloveapi.com/docs/api-reference#authentication) authentication token** required for each API request ([start](https://www.iloveapi.com/docs/api-reference#start), [upload](https://www.iloveapi.com/docs/api-reference#upload), [process](https://www.iloveapi.com/docs/api-reference#process), [download](https://www.iloveapi.com/docs/api-reference#download), etc.).
- **Zod** is used as a schema validator for request options and parameters since this library is built in JavaScript, not TypeScript.
  - This means if you provide invalid options, you will likely receive a **[ZodError](https://zod.dev/ERROR_HANDLING?id=zoderror)**, helping you catch mistakes early before initiating requests.

By using this library, you get a more structured and type-safe way to interact with ILoveIMG’s API ✨

## 📋 Requirements

To use this library, ensure you have the following installed:

1. **NPM** - Package built with version `@10.9.0`.  
2. **Node.js** - Package built with version `@22.12.0`.  

You can download them here:  
- [Download NPM](https://www.npmjs.com/)  
- [Download Node.js](https://nodejs.org/)

## ⚙️ Installation
You can install the library via [NPM](https://www.npmjs.com/). Run the following command:
```sh
npm install @rheyhannh/iloveimg-nodejs
```

## 👋 Getting Started
### Using `then/catch` syntax
```js
import ILoveIMGApi from '@rheyhannh/iloveimg-nodejs';

const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('convertimage');

task.start()
  .then(({ task_id, server, remaining_files }) => {
      return task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg' });
  })
  .then(({ server_filename }) => {
      return task.process();
  })
  .then(({ download_filename, filesize, output_filesize, output_filenumber, output_extensions, timer, status }) => {
      return task.download(); // AxiosResponse
  });
```

### Using `async/await` syntax
```js
import ILoveIMGApi from '@rheyhannh/iloveimg-nodejs';

const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('convertimage');

await task.start();
await task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg' });
await task.process();

const result = await task.download(); // AxiosResponse
```

### List project tasks
```js
import ILoveIMGApi from '@rheyhannh/iloveimg-nodejs';

// Project secretKey required otherwise listTasks() will throw an Error.
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');

// See available optional parameters https://www.iloveapi.com/docs/api-reference#task
const tasks = await iloveimg.listTasks({});

// See https://www.iloveapi.com/docs/api-reference#webhooks at Task response example on data.task
console.log(tasks[0]);
```

### Get current task details
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('convertimage');

// You need to call start() first otherwise details() will throw an Error.
await task.start();
const task_details = await task.details();

// false, when no uploaded files related to task
console.log(task_details);

// When files already uploaded or processing task
// See https://www.iloveapi.com/docs/api-reference#task
console.log(task_details);

// When task finish processing
// See https://www.iloveapi.com/docs/api-reference#webhooks at Task response example on data.task with additional `files` attribute
console.log(task_details); 
```

### Delete current task
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('convertimage');

// You need to call start() first otherwise delete() will throw an Error.
await task.start();
await task.delete();
```

### Get current task tool
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('convertimage');
console.log(task.getTool()); // 'convertimage'
```

### Get current task id
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

// You need to call start() first otherwise it will return undefined.
await task.start();
console.log(task.getTaskId()); // ex:'taskid'
```

### Get current task uploaded files
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

// You need to call start() and add some files first otherwise it will return undefined.
await task.start();
await task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg' });

const files = task.getUploadedFiles(); // An array containing uploaded files
console.log(files[0].server_filename) // ex:'thispropassignedbyiloveimgserver.jpeg'
console.log(files[0].filename) // 'awesome.jpeg'
```

### Get your project remaining files
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

// You need to call start() first otherwise it will return undefined.
await task.start();
console.log(task.getRemainingFiles()); // ex:2320
```

### Delete current task files
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

await task.start();
await task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg' });

const files = task.getUploadedFiles();
console.log(files[0].server_filename) // ex:'xyz.jpeg'

await task.deleteFile({ server_filename: 'xyz.jpeg' })
```

## </> Implementation

### Simplified Request Parameter Handling

During development, structuring request parameters correctly can sometimes be challenging. This library provides method parameters that you can use with specific APIs and tool options in the `process()` API.
Additionally, it includes `Zod` validation, which ensures that required attributes are present and correctly typed before sending a request. If any parameters are missing or incorrectly formatted, a `ZodError` is thrown—helping you catch issues early and avoid unnecessary failed requests to the server.

**Example: Using Generic and Tool-Specific Options in `process()`**
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

await task.start();

// Generic options: These are optional parameters that apply to the `process()` API.
// The library automatically handles required attributes like `task`, `tool`, and `files`, 
// so you only need to provide the optional ones based on your needs.
// Note: Some PDF-related attributes are excluded because this library focuses on IMG processing.
// Reference: https://www.iloveapi.com/docs/api-reference#process
const options = {
    try_image_repair: false,
    custom_string: 'some-value',
};

// Tool-specific options: These are parameters for specific tools. 
// In the ILoveIMG documentation, these are referred to as 'extra parameters'.
// Some attributes are required, and if they are missing or incorrectly typed, a ZodError will be thrown.
// Reference: https://www.iloveapi.com/docs/api-reference#upscaleimage-extra-parameters
const toolOptions = {
    upscaleimage: {
        multiplier: 4,
    }
};

await task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg' });
await task.process(options, toolOptions);

// Zod validation only applies to the tool options used in `newTask()`.
// For example, if you specify options for `convertimage` while using the `upscaleimage` tool, no ZodError will be thrown.
```

**Example: Debugging API Requests**

ILoveApi's provides a [debug](https://www.iloveapi.com/docs/api-reference#testing) mode that allows you to inspect each request sent to their servers. This is particularly useful for testing and understanding what data is being transmitted, such as request bodies, parameters, and other values.

**Important**
- When using debug mode, the API does not actually process your request.
- The response will contain details about your request instead of performing the intended action.
- Debugging does not consume your project’s file usage quota.
- You don’t need to call `start()` before debugging other API methods.

```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

// Debugging `start()` API
await task.start({ debug: true });

// Debugging `addFile()` API
await task.addFile({ debug: true });

// Debugging `deleteFile()` API
await task.deleteFile({ debug: true });

// Debugging `process()` API
await task.process({ debug: true });

// Debugging `download()` API
await task.download({ debug: true });
```

### Making Requests for a Specific Task
Each task initialized with `start()` provides a `getServer()` method, which returns an [AxiosInstance](https://axios-http.com/docs/instance). This instance is pre-configured with the required authentication token and points to the correct ILoveIMG API server. This is useful when you need to send direct requests to the server without using the built-in methods.

**Example: Deleting a Task Without `delete()`**
```js
const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
const task = iloveimg.newTask('upscaleimage');

// Start the task first; otherwise, getServer() will return undefined.
await task.start();

const taskId = task.getTaskId(); // Get the task ID
const axios = task.getServer(); // Get the Axios instance

const endpoint = `task/${taskId}`;
await axios.delete(endpoint);
```

After calling `start()`, let's assume the task ID are `loremipsumdolor` and is assigned to the server `api8g.iloveimg.com`. The above implementation essentially sends the following request:

```http
DELETE https://api8g.iloveimg.com/v1/task/loremipsumdolor
```

### Task Module
When your application integrates with a [webhook system](https://www.iloveapi.com/docs/api-reference#webhooks), ILoveApi's servers will notify your webhook once a task has been processed. In such cases, you may need to download the processed file or retrieve task details for a specific task ID and its assigned server. To streamline this process, you can use the `Task` module, which provides functionality to download processed files and fetch task details effortlessly.

**Example: Downloading a Processed File for a Specific Task ID and Server**
```js
import { Task } from '@rheyhannh/iloveimg-nodejs';

const task = new Task('publicKey', 'secretKey', 'taskId', 'taskServer');

const result = await task.download(); // AxiosResponse
```

**Example: Retrieve Task Details for a Specific Task ID and Server**
```js
import { Task } from '@rheyhannh/iloveimg-nodejs';

const task = new Task('publicKey', 'secretKey', 'taskId', 'taskServer');

const details = await task.details();
```

### Auth Module
If you prefer to use a custom HTTP client like [Got](https://www.npmjs.com/package/got), [Needle](https://www.npmjs.com/package/needle), or another library instead of our built-in Axios-based method, you'll need a way to handle authentication separately. The `Auth` module helps manage authentication by issuing, verifying, and refreshing tokens required for requests to the `ILoveApi` servers.

**Example: Using Auth Module**
```js
import { Auth } from '@rheyhannh/iloveimg-nodejs';

const auth = new Auth('publicKey', 'secretKey');

const token = await auth.getToken(); // JWT
const payload = auth.verifyToken(); // JWT Payload

// Use the token when making requests to the `ILoveApi` server.
// Include it in the `Authorization` header with the 'Bearer' prefix.
```

## 🔮 Whats Next
Here are some next steps you might find useful:
- 📖 **Explore the API Documentation** - Check out the official [ILoveAPI](https://www.iloveapi.com/docs/api-reference) or [ILoveIMG](https://www.iloveapi.com/docs/image-guides) documentation to learn more about the available features.
- 🔧 **Contribute to the Project** – Found a bug or have a feature request? Feel free to open an [issue](https://github.com/rheyhannh/iloveimg-nodejs/issues) or submit a [pull request](https://github.com/rheyhannh/iloveimg-nodejs/pulls). 
- 💬 **Join the Discussion** – Have questions or want to share your experience? Start a [discussion](https://github.com/rheyhannh/iloveimg-nodejs/discussions).
- 🌟 **Give it a Star** – If this library has been helpful for your project, consider giving it a ⭐ to show your support!

Happy coding! 🎉
