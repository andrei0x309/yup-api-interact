## yup-api-interact

> Yup API was discontinued on FEB 2025 as company was acquired. This library is no longer maintained, and is kept here for historical purposes. It will throw an error if used.

Simple library to intercat with YUP API mainly for creating posts.
Works with either the private key of the yup account or a yup account token.
If private key is used token will be generated on the fly and stored in the class instance.

### Usage

```typescript
import { YupAPI } from 'yup-api-interact';
import { PK, token } from './secret';

const yupAPI = new YupAPI( PK ? { PK } : { token });


yupAPI.sendPost({
    content: 'Hello World',
    media: ['https://example.com/image.jpg'],
    platforms: ['twitter', 'bsky', 'threads', 'farcaster', 'lens'],
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});

```

### Notes

For now class is mainly used for posting content.

The type of argument for sendPost is exported as `ISendPostData`, all necesary types are exported.