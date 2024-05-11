'use client'

import React from 'react';
import { provider } from "../services";
import { Credentials } from 'google-auth-library';
import {
    googleLogout,
    hasGrantedAnyScopeGoogle,
    hasGrantedAllScopesGoogle,
    type SuccessAuthCodeResponse,
} from "google-oauth-gsi";

const LoginButtons = () => {
    async function onGoogleLoginSuccess(tokenResponse: SuccessAuthCodeResponse) {
        console.log("(auth-code) tokenResponse: ", tokenResponse)
        const { code } = tokenResponse
        try {
            const response = await fetch(`/api/auth/google`, {
                method: 'POST',
                body: JSON.stringify({ code }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = (await response.json()) as Credentials
            if (!data.id_token) {
                return console.error('Failed to login with google')
            }
            console.log("id_token:", data.id_token)
            // Send id_token to BE
        } catch (err) {
            console.error(err)
        }
    }

    const loginWithCode = provider.useGoogleLogin({
        flow: 'auth-code',
        onSuccess: onGoogleLoginSuccess,
        onError: (res) => console.error('Failed to login with google', res),
    })
    const loginWithToken = provider.useGoogleLogin({
        flow: 'implicit',
        onSuccess: (tokenResponse) => {
            console.log("(implicit) tokenResponse: ", tokenResponse)
            const hasGrantedAnyScope = hasGrantedAnyScopeGoogle(
                tokenResponse,
                'email'
            )
            const hasGrantedAllScopes = hasGrantedAllScopesGoogle(
                tokenResponse,
                'profile'
            )
            console.log("hasGrantedAnyScope: ", hasGrantedAnyScope)
            console.log("hasGrantedAllScopes: ", hasGrantedAllScopes)
        }
    })

    return (
        <div >
            <button onClick={() => loginWithCode()}>
                Sign in with google (auth-code)
            </button>
            <button onClick={() => loginWithToken()}>
                Sign in with google (implicit)
            </button>
            <button onClick={googleLogout}>
                Logout
            </button>
        </div>
    );
}

export default LoginButtons;