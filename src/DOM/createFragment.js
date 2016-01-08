import { remove } from './domMutate';

export default function createDOMFragment( parentNode, nextNode ) {
	let lastItem;
	let treeSuccessListeners = [];
	const context = {};
	const treeLifecycle = {
		addTreeSuccessListener( listener ) {
			treeSuccessListeners.push( listener );
		},
		removeTreeSuccessListener( listener ) {
			for ( let i = 0; i < treeSuccessListeners.length; i++ ) {
				const treeSuccessListener = treeSuccessListeners[i];

				if ( treeSuccessListener === listener ) {
					treeSuccessListeners.splice( i, 1 );
					return;
				}
			}
		}
	};
	return {
		parentNode,
		render(nextItem) {
			if (nextItem) {
				const tree = nextItem.tree.dom;

				if (tree) {
					let activeNode = document.activeElement;

					if (lastItem) {
						tree.update(lastItem, nextItem, treeLifecycle, context);
					} else {
						if (tree) {
							const dom = tree.create(nextItem, treeLifecycle, context);

							if ( nextNode ) {
								parentNode.insertBefore( dom, nextNode );
							} else if ( parentNode ) {
								parentNode.appendChild( dom );
							}
						}
					}
					if (treeSuccessListeners.length > 0) {
						for (let i = 0; i < treeSuccessListeners.length; i++) {
							treeSuccessListeners[i]();
						}
					}
					lastItem = nextItem;
					if (activeNode !== document.body && document.activeElement !== activeNode) {
						activeNode.focus();
					}
				}
			}
		},
		remove() {
			if ( lastItem ) {
				const tree = lastItem.tree.dom;

				if ( lastItem ) {
					tree.remove( lastItem, treeLifecycle );
				}
				remove( lastItem, parentNode );
			}
			treeSuccessListeners = [];
		}
	};
}
