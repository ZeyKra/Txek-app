import config from '@/config.json';
import type TxekMatch from '@/models/TxekMatch';
import type { UserData } from './auth';
import { getStorageToken, getStorageUserData } from '@/app/backend/storage';
import type { TxekRound } from '@/types/TxekRound';
const API_BASE_URL = config.API_URL;

async function registerTxekMatch(txekMatchData: TxekMatch): Promise<string> {
    try {
        // Get token from localStorage
        const token = await getStorageToken();
        const userData: UserData | undefined = await getStorageUserData();

        console.log('Token retrieved:', token); // DEBUG: Log the token being used
        console.log('User data retrieved:', userData); // DEBUG: Log the user data being used
        
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        //TODO ADD Winner
        const matchData: {
            created_at: Date;
            round_max: number;
            players: string[];
            owner_id: string;
            winner?: string;
        } = {
            created_at: txekMatchData.createdAt,
            round_max: txekMatchData.roundMax,
            players: txekMatchData.players.map(player => player.name),
            owner_id: `RecordedUser:${userData?.id}`
        };

        if (txekMatchData.winner) {
            matchData.winner = txekMatchData.winner.name;
        }

        console.log('Match data to be sent:', matchData); // DEBUG: Log the match data being sent
        
        const response = await fetch(`${API_BASE_URL}/protected/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(matchData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering Txek match:', error);
        throw error;
    }
}

async function registerTxekRound(txekRoundData: TxekRound, matchId: string, roundIndex: number): Promise<string> {
    try {
        const token = await getStorageToken();
        const userData: UserData | undefined = await getStorageUserData();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const roundData = {
            round_index: roundIndex, 
            ...txekRoundData,
        };

        const response = await fetch(`${API_BASE_URL}/protected/matches/${matchId}/rounds/filled`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(roundData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering Txek round:', error);
        throw error;
    }
}

async function registerMatchRounds(txekMatch: TxekMatch, matchId: string): Promise<string> {
    try {
        const token = await getStorageToken();
        const userData: UserData | undefined = await getStorageUserData();

        if (!token) {
            throw new Error('No authentication token found');
        }

        let response = '';

        txekMatch.rounds.map(async (txekRoundData: TxekRound, index: number) => {
            const roundData = {
                round_index: index + 1,
                ...txekRoundData
            };
    
            response = await registerTxekRound(roundData, matchId, index + 1);
        });

        return response;
    } catch (error) {
        console.error('Error registering Txek round:', error);
        throw error;
    }
}

async function FetchAPIMatch() {
    try {
        const token = await getStorageToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const userData: UserData | undefined = await getStorageUserData();

        const response = await fetch(`${API_BASE_URL}/protected/user/${userData?.id}/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
}   

async function fetchAPIMatchRounds(matchId: string) {
    try {
        const token = await getStorageToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/protected/matches/${matchId}/rounds`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
}

export { registerTxekMatch, registerMatchRounds, FetchAPIMatch, fetchAPIMatchRounds };