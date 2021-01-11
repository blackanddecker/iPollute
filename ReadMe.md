IPollute
---------

Ipollute is a carbon footprint tracker that helps you learn more about your carbon emissions and carbon footprint from your daily lifestyle. Ipollute can help you towards achieving a sustainable lifestyle, whether through sustainable travel, reducing your dietary carbon footprint, or removing CO2 by offsetting the CO2 emissions you can't avoid.

## Development 

To set up project for development mode
 
 1. Database


 2. Server

Create virtual python3 enviroment

    source env/bin/activate

Add enviromental variables

    export FLASK_ENV=development
    export FLASK_APP=main.py


Start Server

    flask run -h 0.0.0.0

 3. Android

In one terminal run 

    npx react-native start

Then in a second terminal 

Add enviromental variables

    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools

Build Application

    npm run android


## Troubleshooting 

    
    rm package-lock.json && rm -rf node_modules && rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/haste-map-* && npm install
