import {
	S3Client,
	GetObjectCommand,
	ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	region: process.env.S3_REGION!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS!,
		secretAccessKey: process.env.S3_SECRET!,
	},
});

export async function getObjectUrl(prefix: string) {
	const command = new ListObjectsV2Command({
		Bucket: process.env.S3_BUCKET_NAME!,
		Prefix: prefix + "/",
	});
	const { Contents } = await s3Client.send(command);
	const imageUrls: string[] = [];

	if (Contents !== undefined) {
		for (const content of Contents) {
			const command = new GetObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME!,
				Key: content.Key!,
			});
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: 3600,
			});
			imageUrls.push(url);
		}
	}

	return imageUrls.slice(1, imageUrls.length);
}
