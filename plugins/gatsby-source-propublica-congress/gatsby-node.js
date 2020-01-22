const fetch = require("node-fetch")
exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins
  // plugin code goes here...
  const { key } = configOptions
  const options = {
    headers: {
      "X-API-Key": key
    }
  }
  const processMember = member => {
    const nodeId = createNodeId(`propublica-congress-member-${member.id}`)
    const nodeContent = JSON.stringify(member)
    const nodeData = {
      ...member,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `ProPublicaCongressMember`,
        content: nodeContent,
        contentDigest: createContentDigest(member),
      }
    }
    return nodeData;
  }

  return fetch("https://api.propublica.org/congress/v1/116/senate/members.json", options)
    .then(res => res.json())
    .then(data => {
      data.results[0].members.forEach(member => {
        const nodeData = processMember(member);
        createNode(nodeData)
      })
    })
}
