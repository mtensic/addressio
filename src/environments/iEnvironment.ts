export interface IEnvironment {
    production: boolean,
    firebaseConfig: FirebaseConfig
}

export interface FirebaseConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
}