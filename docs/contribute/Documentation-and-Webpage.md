# Scenarioo Web Page and Documentation

## Web Page

Our web page is published through github pages under http://www.scenarioo.org

The webpage is maintained in repository 
https://github.com/scenarioo/scenarioo.github.io

The web page can be changed in that repo by simply do a PR to master and merging it.

See README.md in that repo for further detailed information.

Changes for further releases should not yet been made on master but prepared on special release branches, to be merged on the date of release.

## Documentation

We do not use Wikis!

All our repos have a docs folder with a markdown file documentation using gitbook tooling.

The sources for the major Scenarioo documentation is in the major Scenarioo repository:
https://github.com/scenarioo/scenarioo/tree/develop/docs

This docu is deployed as a part of our webpage using gitbook tooling under the following URLs for different product versions:

* [Master Docs](http://scenarioo.org/docs/master/): This is the docu of the last official released version.
* [Development Docs](http://scenarioo.org/docs/develop/): This is the docu of the current version under development.
* [Specific Release Version Docs  - e.g. for Version 3.0](http://scenarioo.org/docs/3.0/): For every major release we keep one archived published version of the docu. Links in our product usually point to that version of the docu that is currently installed. If we fix / improve the docu of latest release we have to publish it to the latest archived version and as well into the master documentation (by doing the change on the release branch of that version and then merge it to master).

###  How to Publish Documentation

#### Configuration for new Releases

This has still to be done manually before publishing:

* Configuration for a new release version has to be added to `docs/book.json` such that this version appears in the version selection dropdown in the documentation.
* Make sure to set the new version as selected on the release branch (`"selected": true` in `book.json`).
* Make sure to keep the "develop"-version selected on the develop branch - just change it back after the release has been merged to develop).

#### Automatic Publishing

The easiest way to publish the documentation is to use the automation on CircleCI which currently automatically publishes the docu as follows:

* **Develop Docu**: Automatically updated/published on every push to develop branch.
* **Master Docu**: Automatically updated/published on every push to master branch (e.g. for hotfixes).
* **Release Docu (versioned)**: Automatically updated/published on every push to any release/* branch (under the same version number as the name of the release branch, e.g. `4.0` for `release/4.0`).

#### Manual Publishing 

If you ever need to publish manually:

* Make sure the version of scenarioo/scenarioo you want to release the docu for is checked out (usually `develop`, `master` or a release branch).
* ensure you have the uml tooling properly installed (graphviz - see below!)
* Run `npm install` and `npm run build` in `docs` folder.
* Use the npm tooling, similar to `/ci/publishGitbookMarkdownDocu.sh`.
* OR: Copy the generated content of the `docs/_book` folder to the scenarioo.github.io repository into the appropriate subfolder of `docs` for the version you want to deploy
    * Make sure the target folder is cleaned first, if there was already an old version of the docu deployed for that same version, before you copy manually (gh-pages tooling is doing it for you).
    * If this is the docu of the current official released version, please publish both to its concrete version directory as well as to folder `master` (once it is merged to master branch).
    * Commit and push the added / updated documentation versions to master branch on scenarioo.github.io    
* When done: 
    * make sure that your changes to scenarioo/scenarioo are merged to develop 
    * on develop verify in `book.json` that the "develop"-version is configured as selected again!

### Additional Requirements for PlantUML
[PlantUML](https://plantuml.com/) is used to create and display UML diagrams in the documentation. To render the PlantUML diagrams, [Graphviz](https://graphviz.gitlab.io/about/) and Java 8 are required. 
For these reasons, we've setup a special Docker image with the necessary tools installed and use it in the CircleCI job for automatically publishing the documentation. 

The Dockerfile can be found in the [docker](https://github.com/scenarioo/scenarioo/tree/develop/docker/gitbook-docs-ci) directory. 
There is also a README that explains how to update this image.

For more information, refer to the [Scenarioo Docker Hub](https://hub.docker.com/r/scenarioo).
