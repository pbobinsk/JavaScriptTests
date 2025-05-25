import { put } from "@vercel/blob";

const { url } = await put('articles/blob1.txt', 'Hello World 1!', { access: 'public' });