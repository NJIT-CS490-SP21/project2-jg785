import React from 'react';

function leaderboard (){
    return( 
            <div>
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">Tic Tac Toe Leaderboard</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>Ranking score</td>
                        </tr>
                        <tr>
                          <td>Jhon</td>
                          <td> 25 </td>
                      </tr>
                    </tbody>
                </table>
            </div>
    );
}

export default leaderboard;