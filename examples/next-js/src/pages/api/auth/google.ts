import { Credentials, OAuth2Client } from 'google-auth-library';
import type { NextApiRequest, NextApiResponse } from 'next';

const oAuth2Client = new OAuth2Client(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    'postmessage',
);

type ResponseData = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | Credentials>,
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        if (!req.body.code) {
            res.status(400).json({ message: 'No code provided' });
        }

        // exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(req.body.code);
        res.status(500).json(tokens);
    } catch (err) {
        res.status(500).json({ message: 'Internal error' });
    }
}
