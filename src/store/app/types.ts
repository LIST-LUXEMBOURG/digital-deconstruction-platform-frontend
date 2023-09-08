/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


export interface AppState {
  /**
   * The application drawer state (show|hide)
   */
  drawer: boolean; // The application drawer state (show|hide)
  /**
   * The route the client try to reach when he isn't connected
   * Once the user is logged he will be redirect to this route.
   */
  initialRoute: string;
}
