import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadFileToS3 = async (file) => {
    try {
        const command = new PutObjectCommand({
            Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
            Key: file.name,
            Body: fileToReadableStream(file), // ✅ This should be the File/Blob directly
            ContentType: file.type,
        });

        const response = await s3.send(command);
        console.log("Upload successful", response);

        return `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${key}`;
    } catch (err) {
        console.error("S3 Upload Error:", err);
        throw err;
    }
};

const fileToReadableStream = (file) => {
    return new ReadableStream({
        start(controller) {
            const reader = file.stream().getReader();

            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    push();
                });
            }

            push();
        },
    });
};
